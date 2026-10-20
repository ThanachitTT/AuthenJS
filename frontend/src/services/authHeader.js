export const authHeader = () => ({
  headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
});
