/**
 * useMasterState_v2.js
 * 
 * TIC-TAC-TOE ARKITEKTUR - "Game" komponenten
 * 
 * DENNA HOOK ÄR DEN ENDA SOM:
 * - Gör API-anrop
 * - Läser från localStorage
 * - Skriver till localStorage
 * - Navigerar (routing)
 * 
 * ALLA SLIDES ÄR DUMMA - de anropar bara actions.xxx()
 * 
 * Inspirerad av React Tutorial: https://react.dev/learn/tutorial-tic-tac-toe
 */

import { useReducer, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// =============================================================================
// SLIDE CONFIGURATION - Definierar ordningen och metadata för alla slides
// =============================================================================
const SLIDE_ORDER = [
  // Pre-auth (hanteras separat, men definierade för fullständighet)
  { key: 'hero', path: '/', requiresAuth: false },
  { key: 'login', path: '/login', requiresAuth: false },
  { key: 'register', path: '/register', requiresAuth: false },
  { key: 'verify', path: '/verify', requiresAuth: false },
  
  // Onboarding flow (kräver auth)
  { key: 'welcome', path: '/inledning', requiresAuth: true },
  { key: 'intro', path: '/intro', requiresAuth: true },
  { key: 'uppdragsval', path: '/uppdragsval', requiresAuth: true },
  { key: 'riskfragor', path: '/riskfragor', requiresAuth: true },
  { key: 'riskfragor-steg2', path: '/riskfragor-steg2', requiresAuth: true },
  { key: 'riskfragor-steg3', path: '/riskfragor-steg3', requiresAuth: true },
  { key: 'riskfragor-steg4', path: '/riskfragor-steg4', requiresAuth: true },
  
  // Result slides (Roaring data)
  { key: 'verksamhet', path: '/verksamhet', requiresAuth: true },
  { key: 'agarstruktur', path: '/agarstruktur', requiresAuth: true },
  { key: 'styrelse', path: '/styrelse', requiresAuth: true },
  { key: 'ovriga-data', path: '/ovriga-data', requiresAuth: true },
  
  // Document & data collection
  { key: 'bokforing-data', path: '/bokforing-data', requiresAuth: true },
  { key: 'foretagsdokumentation', path: '/foretagsdokumentation', requiresAuth: true },
  { key: 'bokforingsunderlag', path: '/bokforingsunderlag', requiresAuth: true },
  
  // Analysis slides
  { key: 'resultatanalys', path: '/resultatanalys', requiresAuth: true },
  { key: 'likviditetsanalys', path: '/likviditetsanalys', requiresAuth: true },
  { key: 'omsattningsanalys', path: '/omsattningsanalys', requiresAuth: true },
  
  // Final steps
  { key: 'riskbedomning', path: '/riskbedomning', requiresAuth: true },
  { key: 'avtal', path: '/avtal', requiresAuth: true },
  { key: 'payment-success', path: '/payment-success', requiresAuth: true },
  { key: 'support', path: '/support', requiresAuth: true },
];

// =============================================================================
// INITIAL STATE
// =============================================================================
const initialState = {
  // Navigation
  currentSlideKey: null,
  currentSlideIndex: -1,
  
  // Auth
  isAuthenticated: false,
  user: null,
  
  // Active case
  activeCase: null,  // { onboardingId, companyId, companyName, orgnr }
  
  // Form data - alla slides formulärdata
  formData: {},  // { [slideKey]: { field1: value1, ... } }
  
  // Server data - data hämtad från API
  serverData: {
    roaring: null,      // Roaring.io data
    sie: null,          // SIE-fil data
    onboardings: [],    // Lista på pending onboardings
  },
  
  // UI state
  isLoading: false,
  loadingMessage: '',
  error: null,
  
  // Modals
  showResumeModal: false,
  showMergeConflictModal: false,
  mergeConflictData: null,
  
  // Version för optimistic locking
  version: 0,
  
  // Slide completion tracking
  completedSlides: [],  // ['uppdragsval', 'riskfragor', ...]
};

// =============================================================================
// ACTION TYPES
// =============================================================================
const ActionTypes = {
  // Navigation
  NAVIGATE: 'NAVIGATE',
  SET_CURRENT_SLIDE: 'SET_CURRENT_SLIDE',
  
  // Auth
  SET_AUTHENTICATED: 'SET_AUTHENTICATED',
  LOGOUT: 'LOGOUT',
  
  // Case management
  SET_ACTIVE_CASE: 'SET_ACTIVE_CASE',
  CLEAR_ACTIVE_CASE: 'CLEAR_ACTIVE_CASE',
  
  // Form data
  UPDATE_FIELD: 'UPDATE_FIELD',
  SET_SLIDE_DATA: 'SET_SLIDE_DATA',
  CLEAR_FORM_DATA: 'CLEAR_FORM_DATA',
  
  // Server data
  SET_ROARING_DATA: 'SET_ROARING_DATA',
  SET_SIE_DATA: 'SET_SIE_DATA',
  SET_ONBOARDINGS: 'SET_ONBOARDINGS',
  
  // UI state
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  
  // Modals
  SHOW_RESUME_MODAL: 'SHOW_RESUME_MODAL',
  HIDE_RESUME_MODAL: 'HIDE_RESUME_MODAL',
  SHOW_MERGE_CONFLICT: 'SHOW_MERGE_CONFLICT',
  HIDE_MERGE_CONFLICT: 'HIDE_MERGE_CONFLICT',
  
  // Slide completion
  MARK_SLIDE_COMPLETED: 'MARK_SLIDE_COMPLETED',
  
  // Version
  INCREMENT_VERSION: 'INCREMENT_VERSION',
  SET_VERSION: 'SET_VERSION',
  
  // Hydrate from localStorage
  HYDRATE: 'HYDRATE',
};

// =============================================================================
// REDUCER
// =============================================================================
function masterReducer(state, action) {
  switch (action.type) {
    // Navigation
    case ActionTypes.SET_CURRENT_SLIDE: {
      const slideIndex = SLIDE_ORDER.findIndex(s => s.key === action.slideKey);
      return {
        ...state,
        currentSlideKey: action.slideKey,
        currentSlideIndex: slideIndex,
      };
    }
    
    // Auth
    case ActionTypes.SET_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: true,
        user: action.user,
      };
    
    case ActionTypes.LOGOUT:
      return {
        ...initialState,
        // Behåll endast det som inte är user-specifikt
      };
    
    // Case management
    case ActionTypes.SET_ACTIVE_CASE:
      return {
        ...state,
        activeCase: action.caseData,
      };
    
    case ActionTypes.CLEAR_ACTIVE_CASE:
      return {
        ...state,
        activeCase: null,
        formData: {},
        completedSlides: [],
      };
    
    // Form data
    case ActionTypes.UPDATE_FIELD:
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.slideKey]: {
            ...state.formData[action.slideKey],
            [action.field]: action.value,
          },
        },
      };
    
    case ActionTypes.SET_SLIDE_DATA:
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.slideKey]: action.data,
        },
      };
    
    case ActionTypes.CLEAR_FORM_DATA:
      return {
        ...state,
        formData: {},
      };
    
    // Server data
    case ActionTypes.SET_ROARING_DATA:
      return {
        ...state,
        serverData: {
          ...state.serverData,
          roaring: action.data,
        },
      };
    
    case ActionTypes.SET_SIE_DATA:
      return {
        ...state,
        serverData: {
          ...state.serverData,
          sie: action.data,
        },
      };
    
    case ActionTypes.SET_ONBOARDINGS:
      return {
        ...state,
        serverData: {
          ...state.serverData,
          onboardings: action.data,
        },
      };
    
    // UI state
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
        loadingMessage: action.message || '',
      };
    
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.error,
        isLoading: false,
      };
    
    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    
    // Modals
    case ActionTypes.SHOW_RESUME_MODAL:
      return {
        ...state,
        showResumeModal: true,
      };
    
    case ActionTypes.HIDE_RESUME_MODAL:
      return {
        ...state,
        showResumeModal: false,
      };
    
    case ActionTypes.SHOW_MERGE_CONFLICT:
      return {
        ...state,
        showMergeConflictModal: true,
        mergeConflictData: action.data,
      };
    
    case ActionTypes.HIDE_MERGE_CONFLICT:
      return {
        ...state,
        showMergeConflictModal: false,
        mergeConflictData: null,
      };
    
    // Slide completion
    case ActionTypes.MARK_SLIDE_COMPLETED:
      if (state.completedSlides.includes(action.slideKey)) {
        return state;
      }
      return {
        ...state,
        completedSlides: [...state.completedSlides, action.slideKey],
      };
    
    // Version
    case ActionTypes.INCREMENT_VERSION:
      return {
        ...state,
        version: state.version + 1,
      };
    
    case ActionTypes.SET_VERSION:
      return {
        ...state,
        version: action.version,
      };
    
    // Hydrate
    case ActionTypes.HYDRATE:
      return {
        ...state,
        ...action.savedState,
      };
    
    default:
      console.warn(`Unknown action type: ${action.type}`);
      return state;
  }
}

// =============================================================================
// LOCALSTORAGE KEYS
// =============================================================================
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  ACTIVE_CASE: 'active_onboarding',
  FORM_DATA: 'form_data',
  COMPLETED_SLIDES: 'completed_slides',
};

// =============================================================================
// API BASE URL
// =============================================================================
const getApiBase = () => {
  return import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_BASE_URL}/api`;
};

// =============================================================================
// THE HOOK
// =============================================================================
export function useMasterState() {
  const [state, dispatch] = useReducer(masterReducer, initialState);
  const navigate = useNavigate();

  // ===========================================================================
  // LOCALSTORAGE OPERATIONS (endast här!)
  // ===========================================================================
  const storage = {
    // Auth tokens
    getToken: () => localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
    setTokens: (access, refresh) => {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access);
      if (refresh) localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh);
    },
    clearTokens: () => {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    },
    
    // Active case
    getActiveCase: () => {
      const cached = localStorage.getItem(STORAGE_KEYS.ACTIVE_CASE);
      return cached ? JSON.parse(cached) : null;
    },
    setActiveCase: (caseData) => {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_CASE, JSON.stringify(caseData));
    },
    clearActiveCase: () => {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_CASE);
    },
    
    // Form data
    getFormData: () => {
      const cached = localStorage.getItem(STORAGE_KEYS.FORM_DATA);
      return cached ? JSON.parse(cached) : {};
    },
    setFormData: (formData) => {
      localStorage.setItem(STORAGE_KEYS.FORM_DATA, JSON.stringify(formData));
    },
    clearFormData: () => {
      localStorage.removeItem(STORAGE_KEYS.FORM_DATA);
    },
    
    // Completed slides
    getCompletedSlides: () => {
      const cached = localStorage.getItem(STORAGE_KEYS.COMPLETED_SLIDES);
      return cached ? JSON.parse(cached) : [];
    },
    setCompletedSlides: (slides) => {
      localStorage.setItem(STORAGE_KEYS.COMPLETED_SLIDES, JSON.stringify(slides));
    },
  };

  // ===========================================================================
  // API OPERATIONS (endast här!)
  // ===========================================================================
  const api = {
    // Generic fetch with auth
    fetch: async (endpoint, options = {}) => {
      const token = storage.getToken();
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      };
      
      const response = await fetch(`${getApiBase()}${endpoint}`, {
        ...options,
        headers,
      });
      
      return response;
    },
    
    // Fetch pending onboardings
    fetchOnboardings: async () => {
      dispatch({ type: ActionTypes.SET_LOADING, isLoading: true, message: 'Hämtar ärenden...' });
      try {
        const response = await api.fetch('/onboarding/list');
        if (response.ok) {
          const data = await response.json();
          dispatch({ type: ActionTypes.SET_ONBOARDINGS, data: data.onboardings || [] });
          return data.onboardings || [];
        }
        throw new Error('Failed to fetch onboardings');
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, error: error.message });
        return [];
      } finally {
        dispatch({ type: ActionTypes.SET_LOADING, isLoading: false });
      }
    },
    
    // Fetch Roaring data
    fetchRoaringData: async (orgnr) => {
      dispatch({ type: ActionTypes.SET_LOADING, isLoading: true, message: 'Hämtar företagsdata...' });
      try {
        const response = await api.fetch(`/roaring?orgnr=${orgnr}`);
        if (response.ok) {
          const data = await response.json();
          dispatch({ type: ActionTypes.SET_ROARING_DATA, data });
          return data;
        }
        throw new Error('Failed to fetch Roaring data');
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, error: error.message });
        return null;
      } finally {
        dispatch({ type: ActionTypes.SET_LOADING, isLoading: false });
      }
    },
    
    // Save progress to server
    saveProgress: async (slideKey, data) => {
      try {
        const response = await api.fetch('/onboarding/save', {
          method: 'PUT',
          body: JSON.stringify({
            onboarding_id: state.activeCase?.onboardingId,
            slide_key: slideKey,
            data,
            expected_version: state.version,
          }),
        });
        
        // Handle merge conflict (409)
        if (response.status === 409) {
          const conflict = await response.json();
          dispatch({
            type: ActionTypes.SHOW_MERGE_CONFLICT,
            data: {
              serverData: conflict.server_data,
              localData: data,
              updatedBy: conflict.updated_by,
              updatedAt: conflict.updated_at,
            },
          });
          return false;
        }
        
        if (response.ok) {
          const result = await response.json();
          dispatch({ type: ActionTypes.SET_VERSION, version: result.version });
          return true;
        }
        
        throw new Error('Failed to save progress');
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, error: error.message });
        return false;
      }
    },
    
    // Resume onboarding
    resumeOnboarding: async (companyId, onboardingId) => {
      dispatch({ type: ActionTypes.SET_LOADING, isLoading: true, message: 'Återupptar ärende...' });
      try {
        const response = await api.fetch(`/onboarding/resume/${companyId}?onboarding_id=${onboardingId}`);
        if (response.ok) {
          const data = await response.json();
          return data;
        }
        throw new Error('Failed to resume onboarding');
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, error: error.message });
        return null;
      } finally {
        dispatch({ type: ActionTypes.SET_LOADING, isLoading: false });
      }
    },
    
    // Delete onboarding
    deleteOnboarding: async (companyId, onboardingId) => {
      try {
        const response = await api.fetch(`/onboarding/delete/${companyId}?onboarding_id=${onboardingId}`, {
          method: 'DELETE',
        });
        return response.ok;
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, error: error.message });
        return false;
      }
    },
  };

  // ===========================================================================
  // NAVIGATION ACTIONS (endast här!)
  // ===========================================================================
  const navigation = {
    // Go to next slide
    next: useCallback(() => {
      const currentIndex = state.currentSlideIndex;
      if (currentIndex < SLIDE_ORDER.length - 1) {
        const nextSlide = SLIDE_ORDER[currentIndex + 1];
        
        // Mark current slide as completed
        dispatch({ type: ActionTypes.MARK_SLIDE_COMPLETED, slideKey: state.currentSlideKey });
        
        // Save to localStorage
        storage.setCompletedSlides([...state.completedSlides, state.currentSlideKey]);
        storage.setFormData(state.formData);
        
        // Navigate
        dispatch({ type: ActionTypes.SET_CURRENT_SLIDE, slideKey: nextSlide.key });
        navigate(nextSlide.path);
      }
    }, [state.currentSlideIndex, state.currentSlideKey, state.completedSlides, state.formData, navigate]),
    
    // Go to previous slide
    back: useCallback(() => {
      const currentIndex = state.currentSlideIndex;
      if (currentIndex > 0) {
        const prevSlide = SLIDE_ORDER[currentIndex - 1];
        dispatch({ type: ActionTypes.SET_CURRENT_SLIDE, slideKey: prevSlide.key });
        navigate(prevSlide.path);
      }
    }, [state.currentSlideIndex, navigate]),
    
    // Go to specific slide
    goTo: useCallback((slideKey) => {
      const slide = SLIDE_ORDER.find(s => s.key === slideKey);
      if (slide) {
        dispatch({ type: ActionTypes.SET_CURRENT_SLIDE, slideKey: slide.key });
        navigate(slide.path);
      }
    }, [navigate]),
    
    // Go to path directly (for special cases like login)
    goToPath: useCallback((path) => {
      const slide = SLIDE_ORDER.find(s => s.path === path);
      if (slide) {
        dispatch({ type: ActionTypes.SET_CURRENT_SLIDE, slideKey: slide.key });
      }
      navigate(path);
    }, [navigate]),
  };

  // ===========================================================================
  // FORM ACTIONS
  // ===========================================================================
  const form = {
    // Update a single field
    updateField: useCallback((slideKey, field, value) => {
      dispatch({ type: ActionTypes.UPDATE_FIELD, slideKey, field, value });
      
      // Auto-save to localStorage
      const newFormData = {
        ...state.formData,
        [slideKey]: {
          ...state.formData[slideKey],
          [field]: value,
        },
      };
      storage.setFormData(newFormData);
    }, [state.formData]),
    
    // Set all data for a slide
    setSlideData: useCallback((slideKey, data) => {
      dispatch({ type: ActionTypes.SET_SLIDE_DATA, slideKey, data });
      
      // Auto-save to localStorage
      const newFormData = {
        ...state.formData,
        [slideKey]: data,
      };
      storage.setFormData(newFormData);
    }, [state.formData]),
    
    // Get data for a slide
    getSlideData: useCallback((slideKey) => {
      return state.formData[slideKey] || {};
    }, [state.formData]),
  };

  // ===========================================================================
  // CASE ACTIONS
  // ===========================================================================
  const caseActions = {
    // Set active case
    setActiveCase: useCallback((caseData) => {
      dispatch({ type: ActionTypes.SET_ACTIVE_CASE, caseData });
      storage.setActiveCase(caseData);
    }, []),
    
    // Clear active case
    clearActiveCase: useCallback(() => {
      dispatch({ type: ActionTypes.CLEAR_ACTIVE_CASE });
      storage.clearActiveCase();
      storage.clearFormData();
    }, []),
    
    // Resume a case
    resumeCase: useCallback(async (companyId, onboardingId) => {
      const data = await api.resumeOnboarding(companyId, onboardingId);
      if (data) {
        const caseData = {
          onboardingId: data.onboarding_id,
          companyId: data.company_id,
          companyName: data.company_name,
          orgnr: data.orgnr,
        };
        dispatch({ type: ActionTypes.SET_ACTIVE_CASE, caseData });
        storage.setActiveCase(caseData);
        
        // Navigate to the resume point
        if (data.current_slide) {
          navigation.goTo(data.current_slide);
        } else {
          navigation.goTo('uppdragsval');
        }
      }
    }, []),
    
    // Delete a case
    deleteCase: useCallback(async (companyId, onboardingId) => {
      const success = await api.deleteOnboarding(companyId, onboardingId);
      if (success) {
        // Refresh onboardings list
        await api.fetchOnboardings();
      }
      return success;
    }, []),
  };

  // ===========================================================================
  // AUTH ACTIONS
  // ===========================================================================
  const auth = {
    // Set authenticated (called after successful login)
    setAuthenticated: useCallback((user, tokens) => {
      storage.setTokens(tokens.access, tokens.refresh);
      dispatch({ type: ActionTypes.SET_AUTHENTICATED, user });
    }, []),
    
    // Logout
    logout: useCallback(() => {
      storage.clearTokens();
      storage.clearActiveCase();
      storage.clearFormData();
      dispatch({ type: ActionTypes.LOGOUT });
      navigate('/');
    }, [navigate]),
    
    // Check if authenticated
    isAuthenticated: useCallback(() => {
      return !!storage.getToken();
    }, []),
  };

  // ===========================================================================
  // MODAL ACTIONS
  // ===========================================================================
  const modals = {
    showResumeModal: useCallback(() => {
      dispatch({ type: ActionTypes.SHOW_RESUME_MODAL });
    }, []),
    
    hideResumeModal: useCallback(() => {
      dispatch({ type: ActionTypes.HIDE_RESUME_MODAL });
    }, []),
    
    hideMergeConflict: useCallback(() => {
      dispatch({ type: ActionTypes.HIDE_MERGE_CONFLICT });
    }, []),
    
    // Handle merge conflict resolution
    resolveMergeConflict: useCallback((choice) => {
      // choice: 'keep-theirs', 'keep-mine', 'merge'
      // TODO: Implement merge logic
      dispatch({ type: ActionTypes.HIDE_MERGE_CONFLICT });
    }, []),
  };

  // ===========================================================================
  // INITIALIZATION
  // ===========================================================================
  const initialize = useCallback(async () => {
    dispatch({ type: ActionTypes.SET_LOADING, isLoading: true, message: 'Initierar...' });
    
    try {
      // Check for token
      const token = storage.getToken();
      if (!token) {
        dispatch({ type: ActionTypes.SET_LOADING, isLoading: false });
        return;
      }
      
      // Hydrate from localStorage
      const activeCase = storage.getActiveCase();
      const formData = storage.getFormData();
      const completedSlides = storage.getCompletedSlides();
      
      if (activeCase) {
        dispatch({ type: ActionTypes.SET_ACTIVE_CASE, caseData: activeCase });
      }
      
      dispatch({
        type: ActionTypes.HYDRATE,
        savedState: {
          formData,
          completedSlides,
          isAuthenticated: true,
        },
      });
      
      // Fetch pending onboardings
      const onboardings = await api.fetchOnboardings();
      
      // If there are pending onboardings, show resume modal
      if (onboardings.length > 0) {
        dispatch({ type: ActionTypes.SHOW_RESUME_MODAL });
      }
      
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, error: error.message });
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, isLoading: false });
    }
  }, []);

  // ===========================================================================
  // RETURN - The "Game" interface
  // ===========================================================================
  return {
    // State (read-only for slides)
    state,
    
    // Actions (what slides can call)
    actions: {
      // Navigation
      next: navigation.next,
      back: navigation.back,
      goTo: navigation.goTo,
      goToPath: navigation.goToPath,
      
      // Form
      updateField: form.updateField,
      setSlideData: form.setSlideData,
      getSlideData: form.getSlideData,
      
      // Case
      setActiveCase: caseActions.setActiveCase,
      clearActiveCase: caseActions.clearActiveCase,
      resumeCase: caseActions.resumeCase,
      deleteCase: caseActions.deleteCase,
      
      // Auth
      setAuthenticated: auth.setAuthenticated,
      logout: auth.logout,
      isAuthenticated: auth.isAuthenticated,
      
      // Modals
      showResumeModal: modals.showResumeModal,
      hideResumeModal: modals.hideResumeModal,
      hideMergeConflict: modals.hideMergeConflict,
      resolveMergeConflict: modals.resolveMergeConflict,
      
      // API (för specialfall - helst undvika direkt anrop)
      fetchRoaringData: api.fetchRoaringData,
      fetchOnboardings: api.fetchOnboardings,
      saveProgress: api.saveProgress,
      
      // Initialize
      initialize,
    },
    
    // Helpers
    helpers: {
      getSlideConfig: (key) => SLIDE_ORDER.find(s => s.key === key),
      getSlideByPath: (path) => SLIDE_ORDER.find(s => s.path === path),
      isSlideCompleted: (key) => state.completedSlides.includes(key),
      canAccessSlide: (key) => {
        const slideIndex = SLIDE_ORDER.findIndex(s => s.key === key);
        const slide = SLIDE_ORDER[slideIndex];
        
        // Pre-auth slides always accessible
        if (!slide?.requiresAuth) return true;
        
        // Must be authenticated
        if (!state.isAuthenticated) return false;
        
        // First auth slide always accessible
        const firstAuthSlide = SLIDE_ORDER.find(s => s.requiresAuth);
        if (slide.key === firstAuthSlide?.key) return true;
        
        // Previous slide must be completed
        const prevSlide = SLIDE_ORDER[slideIndex - 1];
        return state.completedSlides.includes(prevSlide?.key);
      },
    },
  };
}

// =============================================================================
// SLIDE ORDER EXPORT (för andra komponenter som behöver veta ordningen)
// =============================================================================
export { SLIDE_ORDER };

export default useMasterState;
