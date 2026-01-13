import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { FetchedGenre } from "@/types/fetchedGenre";

interface MediaCardProps {
  genre: FetchedGenre;
}

export default function MediaCard({ genre }: MediaCardProps) {
  return (
    <Card
      sx={{
        border: "2px solid #E5E5E5",
        boxShadow: "none",
        position: "relative",
        height: 300,
        backgroundImage: `url(${genre.genreImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(to bottom, transparent 0%, transparent 10%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 70%, rgba(0,0,0,1) 100%)",
          zIndex: 1,
        },
      }}
    >
      <CardContent
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 2,
          color: "white",
          padding: "16px",
        }}
      >
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          sx={{
            color: "#dea85d", // Primary color
            fontWeight: "bold",
            marginBottom: "8px",
          }}
        >
          {genre.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "rgba(255, 255, 255, 0.9)", // Whitish color
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {genre.description}
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 2,
          padding: 0,
        }}
      >
        <Button
          size="small"
          sx={{
            color: "white",
            backgroundColor: "rgba(0,0,0,0.5)",
            minWidth: "auto",
            padding: "2px 10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "3px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.7)",
            },
          }}
        >
          Edit
        </Button>
        <Button
          size="small"
          sx={{
            color: "white",
            backgroundColor: "rgba(220,53,69,0.8)",
            minWidth: "auto",
            padding: "2px 10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "3px",
            marginLeft: "4px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "rgba(220,53,69,1)",
            },
          }}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}
