// import React, { createRef } from 'react';
// import Line from './Line';

// const LeaderLine = ({ elements = [1, 2, 3, 4, 5], ...props }) => {
//   const [elRefs, setElRefs] = React.useState([]);
//   React.useEffect(() => {
//     setElRefs((elRefs) =>
//       Array(elements.length)
//         .fill()
//         .map((_, i) => elRefs[i] || createRef()),
//     );
//   }, [elements.length]);
//   console.log(elRefs);

//   return (
//     <div className='els'>
//       {elements.map((el, i) => (
//         <div className='el' key={i} ref={elRefs[i]}>
//           ...
//         </div>
//       ))}
//       {elRefs.length && <Line start={elRefs[0].current} end={elRefs[1].current} />}
//     </div>
//   );
// };
// export default LeaderLine;
