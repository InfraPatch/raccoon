import loading from '@/assets/images/loading.svg';

const Loading = () => {
  return (
    <div className="flex-1">
      <img src={loading} alt="Loading..." className="max-w-full mx-auto" />
    </div>
  );
};

export default Loading;
