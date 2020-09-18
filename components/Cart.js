import Lottie from 'react-lottie';
import animationData from '../lotties/add-to-cart.json';

export default function Animation({
    isStopped,
    className
}) {
  const defaultOptions = {
    loop: false,
    autoplay: false,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className={ className }>
      <Lottie
        options={defaultOptions}
        height={32}
        width={32}
        isStopped={!isStopped}
      />
    </div>
  );
}