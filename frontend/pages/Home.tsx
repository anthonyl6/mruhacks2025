function Home() {
  return (
    <div className='flex flex-col justify-center align-middle h-screen'>
      <h2 className='text-center font-bold text-2xl mb-4'>Split bills with just a single link!</h2>
      <div className='box my-4 p-4 border-green-500 bg-green-500 '>
        <a href='mojo://launch' className=' text-black font-extrabold hover:underline'>Get started with our mobile app!</a>
      </div>
      <div className='box my-4 p-4 border-blue-500 bg-blue-500 text-center'>
        <a href="/register" className=' text-black font-extrabold hover:underline'>Register Now</a>
      </div>
    </div>
  );
}

export default Home;