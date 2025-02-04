export const calculatePerformance = (seriesData) => {
  const categories = Object.keys(seriesData);
  let totalTasks = 0;
  let completedTasks = 0;

  categories.forEach(category => {
    seriesData[category].forEach(value => {
      totalTasks += value;
      if (category === "Completed") {
        completedTasks += value;
      }
    });
  });

  const performance = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  return performance.toFixed(1) + "%";
}
