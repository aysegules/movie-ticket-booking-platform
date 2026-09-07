const BlurCircle = ({
  top = "auto",
  left = "auto",
  right = "auto",
  bottom = "auto",
}) => {
  return (
    <div
      style={{ top, left, right, bottom }}
      className="absolute -z-50 aspect-square h-58 w-58 rounded-full bg-primary/30 blur-3xl"
    />
  );
};

export default BlurCircle;
