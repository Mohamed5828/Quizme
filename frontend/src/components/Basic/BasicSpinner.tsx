const BasicSpinner = ({ className }: { className?: string }) => {
  return (
    <div
      className={`flex flex-row animate-pulse justify-center items-center h-full pt-20 ${className}`}
    >
      <div
        className="bg-gray-800 w-3 h-3 rounded-full animate-bounce"
        style={{ animationDelay: "0.0s" }}
      ></div>
      <div
        className="bg-gray-800 w-3 h-3 ml-1.5 rounded-full animate-bounce"
        style={{ animationDelay: "0.25s" }}
      ></div>
      <div
        className="bg-gray-800 w-3 h-3 ml-1.5 rounded-full animate-bounce"
        style={{ animationDelay: "0.5s" }}
      ></div>
    </div>
  );
};

export default BasicSpinner;
