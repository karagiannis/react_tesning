export default function KontrolltabellSlide({ onNext }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-8">
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-2xl p-10">
        <h1 className="text-3xl font-bold text-amber-900 mb-4">
          Identitetskontroll – sammanfattande tabell
        </h1>
        
        <p className="text-sm text-amber-700 mb-6 italic">
          Tabellen nedan sammanfattar kraven enligt Länsstyrelsen Stockholms författningssamling 01FS 2024:20 
          och lagen (2017:630) om åtgärder mot penningtvätt och finansiering av terrorism.
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border border-amber-300 text-sm">
            <thead>
              <tr className="bg-amber-800 text-white">
                <th className="border border-amber-300 p-3 text-left font-semibold">Vem kontrolleras</th>
                <th className="border border-amber-300 p-3 text-left font-semibold">Vad kontrolleras</th>
                <th className="border border-amber-300 p-3 text-left font-semibold">Dokumentation av kontrollen</th>
              </tr>
            </thead>
            <tbody>
              {/* Fysisk person */}
              <tr className="bg-amber-50">
                <td className="border border-amber-300 p-3 font-semibold align-top">Fysisk person</td>
                <td className="border border-amber-300 p-3 align-top">
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Pass, körkort eller annan identitetshandling med foto utfärdad av myndighet eller tillförlitlig utfärdare.</li>
                    <li>Tillförlitlig elektronisk legitimation.</li>
                    <li>Andra dokument/uppgifter från oberoende och tillförlitliga källor. Vid svårigheter, använd flera källor.</li>
                  </ol>
                </td>
                <td className="border border-amber-300 p-3 align-top">
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Anteckna identitetshandlingens nummer och giltighetstid eller bevara kopia.</li>
                    <li>Bevara kopia av bekräftelsen på elektronisk legitimation.</li>
                    <li>Bevara kopia av dokument/uppgifter som legat till grund för kontrollen.</li>
                  </ol>
                </td>
              </tr>

              {/* Fysisk person på distans */}
              <tr className="bg-white">
                <td className="border border-amber-300 p-3 font-semibold align-top">Fysisk person på distans</td>
                <td className="border border-amber-300 p-3 align-top">
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Tillförlitlig elektronisk legitimation.</li>
                    <li>Namn, personnummer/samordningsnummer och adress mot externa register/intyg/oberoende källor, samt:
                      <ul className="list-disc list-inside ml-4 mt-1">
                        <li>a) Skicka bekräftelse till folkbokföringsadress, eller</li>
                        <li>b) Inhämta vidimerad kopia av identitetshandling.</li>
                      </ul>
                    </li>
                  </ol>
                </td>
                <td className="border border-amber-300 p-3 align-top">
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Bevara kopia av bekräftelsen på elektronisk legitimation.</li>
                    <li>Bevara kopia av dokument/uppgifter som legat till grund för kontrollen samt kopia av bekräftelsebrev eller vidimerad kopia.</li>
                  </ol>
                </td>
              </tr>

              {/* Företrädare, ombud */}
              <tr className="bg-amber-50">
                <td className="border border-amber-300 p-3 font-semibold align-top">Företrädare, ombud eller motsvarande</td>
                <td className="border border-amber-300 p-3 align-top">
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Se identitetskontroll för fysisk person eller fysisk person på distans.</li>
                    <li>Fullmakt, förordnande eller motsvarande behörighetshandling.</li>
                  </ol>
                </td>
                <td className="border border-amber-300 p-3 align-top">
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Se dokumentationskrav för fysisk person eller fysisk person på distans.</li>
                    <li>Bevara kopia av fullmakt, förordnande eller motsvarande behörighetshandling.</li>
                  </ol>
                </td>
              </tr>

              {/* Juridisk person */}
              <tr className="bg-white">
                <td className="border border-amber-300 p-3 font-semibold align-top">Juridisk person</td>
                <td className="border border-amber-300 p-3 align-top">
                  Registreringsbevis, registerutdrag eller uppgifter från andra tillförlitliga och oberoende källor.
                </td>
                <td className="border border-amber-300 p-3 align-top">
                  Bevara kopia av de kontrollerade handlingarna.
                </td>
              </tr>

              {/* Verklig huvudman */}
              <tr className="bg-amber-50">
                <td className="border border-amber-300 p-3 font-semibold align-top">Verklig huvudman</td>
                <td className="border border-amber-300 p-3 align-top">
                  Se identitetskontroll för fysisk person eller fysisk person på distans.
                </td>
                <td className="border border-amber-300 p-3 align-top">
                  Se dokumentationskrav för fysisk person eller fysisk person på distans.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* References */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6">
          <p className="text-sm font-semibold text-blue-900 mb-2">📚 Se även:</p>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Länsstyrelsen Stockholms författningssamling 01FS 2024:20, 3 kap. 4 § och tabell 1</li>
            <li>Lagen (2017:630) om åtgärder mot penningtvätt och finansiering av terrorism</li>
          </ul>
        </div>

        {/* Info box */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded mb-6">
          <p className="text-sm text-amber-900">
            <strong>⚖️ Notera:</strong> Denna detaljerade tabell visar hur noggranna och specifika Länsstyrelsens 
            krav är. Varje kategori av person har olika kontrollmetoder och dokumentationskrav som måste följas 
            för att undvika sanktionsavgifter.
          </p>
        </div>

        <button
          onClick={onNext}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-all"
        >
          Nästa
        </button>
      </div>
    </div>
  );
}
