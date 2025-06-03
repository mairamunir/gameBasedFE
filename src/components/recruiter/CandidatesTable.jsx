import React, { useEffect, useState } from 'react';
import api from '@/lib/api';

const CandidatesTable = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTopCandidates() {
      try {
        setLoading(true);
        const res = await api.get('/api/dashboard/top-candidates');
        setCandidates(res.data.topCandidates);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load candidate data');
      } finally {
        setLoading(false);
      }
    }

    fetchTopCandidates();
  }, []);

  if (loading) return <div className="text-white p-4">Loading candidates...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (candidates.length === 0)
    return <div className="text-gray-300 p-4">No candidate data available.</div>;

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-2xl font-semibold text-white mb-4">Top Performing Candidates</h2>
      <table className="min-w-full text-white border border-gray-600 rounded-md overflow-hidden shadow-lg">
        <thead className="bg-gray-800 text-sm">
          <tr>
            <th className="px-4 py-2 border">Rank</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Avg. Score</th>
            <th className="px-4 py-2 border">Modules Completed</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((c, i) => {
            const badgeColor =
              i === 0 ? 'bg-yellow-400' :
              i === 1 ? 'bg-gray-400' :
              i === 2 ? 'bg-amber-700' : null;

            return (
              <tr key={c.user_id} className="bg-gray-900 hover:bg-gray-700 text-white text-sm">
                <td className="px-4 py-2 border text-center">
                  {badgeColor ? (
                    <span className={`px-2 py-1 rounded-full text-black text-xs font-bold ${badgeColor}`}>
                      TOP {i + 1}
                    </span>
                  ) : (
                    i + 1
                  )}
                </td>
                <td className="px-4 py-2 border">{c.name}</td>
                <td className="px-4 py-2 border">{c.email}</td>
                <td className="px-4 py-2 border text-center font-bold">{c.averageScore}</td>
                <td className="px-4 py-2 border text-center">{c.totalModulesCompleted}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CandidatesTable;



// import React, { useEffect, useState } from 'react';

// const CandidatesTable = () => {
//   const [candidates, setCandidates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     async function fetchCandidates() {
//       try {
//         setLoading(true);
//         // Replace this URL with your actual API endpoint
//         const res = await fetch('/api/candidates');
//         if (!res.ok) throw new Error('Failed to fetch');
//         const data = await res.json();

//         // Optional: Sort by totalScore descending
//         data.sort((a, b) => b.totalScore - a.totalScore);

//         setCandidates(data);
//         setLoading(false);
//       } catch (err) {
//         setError(err.message || 'Failed to load candidate data');
//         setLoading(false);
//       }
//     }
//     fetchCandidates();
//   }, []);

//   if (loading) return <div className="text-white p-4">Loading candidates...</div>;
//   if (error) return <div className="text-red-500 p-4">{error}</div>;

//   if (candidates.length === 0)
//     return <div className="text-gray-300 p-4">No candidate data available.</div>;

//   return (
//     <div className="overflow-x-auto">
//       <table className="min-w-full text-white border border-gray-600">
//         <thead className="bg-gray-800">
//           <tr>
//             <th className="px-4 py-2 border">#</th>
//             <th className="px-4 py-2 border">Name</th>
//             <th className="px-4 py-2 border">Email</th>
//             <th className="px-4 py-2 border">Total Score</th>
//             <th className="px-4 py-2 border">Leadership</th>
//             <th className="px-4 py-2 border">Emotional Intelligence</th>
//             <th className="px-4 py-2 border">Teamwork</th>
//             <th className="px-4 py-2 border">Decision Making</th>
//           </tr>
//         </thead>
//         <tbody>
//           {candidates.map((c, i) => (
//             <tr
//               key={c.userId || i}
//               className="hover:bg-gray-700"
//             >
//               <td className="px-4 py-2 border text-center">{i + 1}</td>
//               <td className="px-4 py-2 border">{c.name}</td>
//               <td className="px-4 py-2 border">{c.email}</td>
//               <td className="px-4 py-2 border text-center">{c.totalScore}</td>
//               <td className="px-4 py-2 border text-center">{c.modules?.leadership ?? '-'}</td>
//               <td className="px-4 py-2 border text-center">{c.modules?.emotionalIntelligence ?? '-'}</td>
//               <td className="px-4 py-2 border text-center">{c.modules?.teamwork ?? '-'}</td>
//               <td className="px-4 py-2 border text-center">{c.modules?.decisionMaking ?? '-'}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default CandidatesTable;