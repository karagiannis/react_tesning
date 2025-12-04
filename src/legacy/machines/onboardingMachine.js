import { createMachine, assign } from 'xstate';

export const OnboardingMachine = createMachine({
  id: 'onboarding',
  initial: 'hero',
  context: {
    userData: {},
    isPEP: false,
    riskScore: null,
    slides: [],
  },
  states: {
    hero: {
      on: { NEXT: 'login' }
    },
    login: {
      on: { 
        NEXT: 'riskFragor',
        REGISTER: 'register'
      }
    },
    register: {
      on: { NEXT: 'verify' }
    },
    verify: {
      on: { NEXT: 'riskFragor' }
    },
    riskFragor: {
      on: {
        NEXT: [
          { target: 'identitetskontroll', guard: (context) => !context.isPEP },
          { target: 'pepFordjupning', guard: (context) => context.isPEP }
        ]
      }
    },
    pepFordjupning: {
      on: { NEXT: 'identitetskontroll' }
    },
    identitetskontroll: {
      on: { NEXT: 'fetchData' }
    },
    fetchData: {
      invoke: {
        src: 'fetchBolagsverket',
        onDone: { target: 'resultSlides', actions: assign({ slides: (context, event) => event.data }) },
        onError: 'error'
      }
    },
    resultSlides: {
      on: { NEXT: 'ekoRad' }
    },
    ekoRad: {
      on: { NEXT: 'layering' }
    },
    layering: {
      on: { NEXT: 'likviditetsgraf' }
    },
    likviditetsgraf: {
      on: { NEXT: 'riskbesked' }
    },
    riskbesked: {
      on: {
        ACCEPT: 'skyldigheter',
        REJECT: 'avsluta'
      }
    },
    skyldigheter: {
      on: { NEXT: 'avtal' }
    },
    avtal: {
      on: { SIGN: 'bekraftelse' }
    },
    bekraftelse: {
      type: 'final'
    },
    avsluta: {
      type: 'final'
    },
    error: {
      on: { RETRY: 'riskFragor' }
    }
  }
});