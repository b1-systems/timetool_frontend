import ReplayIcon from "@mui/icons-material/Replay";
import { Alert, AlertTitle, Button } from "@mui/material";
import { useTranslation } from "react-i18next";

interface Props {
  error: Error;
  resetErrorBoundary(): void;
}
const ErrorFallback = (props: Props) => {
  const { error, resetErrorBoundary } = props;
  const { t } = useTranslation();

  return (
    <Alert
      severity="error"
      action={
        <Button
          color="inherit"
          onClick={() => {
            resetErrorBoundary();
          }}
          startIcon={<ReplayIcon />}
        >
          {t("error.try_again")}
        </Button>
      }
    >
      <AlertTitle>{t("error.title")}</AlertTitle>
      {t("error.fallback.explanation")}
      <br />
      {t("error.fallback.options")}
      <pre>{error.toString()}</pre>
    </Alert>
  );
};
export default ErrorFallback;
