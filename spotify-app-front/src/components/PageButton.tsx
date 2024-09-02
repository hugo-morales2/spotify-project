import { useNavigate } from "react-router-dom";

interface ButtonProps {
  name: string;
  link: string;
}

const PageButton = ({ name, link }: ButtonProps) => {
  const navigate = useNavigate();

  return (
    <button
      className="pageSelectButton w-26 bg-gray-600 p-3 rounded-full hover:bg-gray-500"
      onClick={() => {
        navigate(link);
      }}
    >
      {name}
    </button>
  );
};

export default PageButton;
