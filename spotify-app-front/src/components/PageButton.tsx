import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface ButtonProps {
  name: string;
  link: string;
}

const PageButton = ({ name, link }: ButtonProps) => {
  const navigate = useNavigate();

  return (
    <Button
      size="lg"
      variant="secondary"
      className="pageSelectButton"
      onClick={() => {
        navigate(link);
      }}
    >
      {name}
    </Button>
  );
};

export default PageButton;
