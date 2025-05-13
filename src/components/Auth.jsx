const Auth = () => {
  const handleLogin = (provider) => {
    // Placeholder logic
    alert(`Logging in with ${provider}`);
  };

  return (
    <div className="flex justify-center gap-4 mt-6">
      <button onClick={() => handleLogin('Google')} className="button-clean">Login with Google</button>
      <button onClick={() => handleLogin('GitHub')} className="button-clean">Login with GitHub</button>
    </div>
  );
};

export default Auth;