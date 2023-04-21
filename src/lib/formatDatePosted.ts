const formatDatePosted = (date: string) => {
  const now = new Date(Date.now());
  const current = new Date(date);
  const diff = now.getTime() - current.getTime();
  return (diff/1000/60/60).toFixed();
}

export default formatDatePosted;