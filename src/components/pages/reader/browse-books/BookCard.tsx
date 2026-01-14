"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { FetchedBook } from "@/types/fetchedBook";
import { useRouter } from "next/navigation";

interface BookCardProps {
  book: FetchedBook;
}

export default function BookCard({ book }: BookCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/reader/browse-books/${book._id}`);
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        border: "2px solid #E5E5E5",
        boxShadow: "none",
        position: "relative",
        height: 400,
        backgroundImage: `url(${book.coverImage})`,
        backgroundSize: { xs: "contain", md: "cover" },
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: { xs: "#000", md: "transparent" },
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: {
            xs: "linear-gradient(to bottom, transparent 0%, transparent 40%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.7) 80%, rgba(0,0,0,0.95) 100%)",
            md: "linear-gradient(to bottom, transparent 0%, transparent 10%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 70%, rgba(0,0,0,1) 100%)",
          },
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
          variant="h6"
          component="div"
          sx={{
            color: "#dea85d",
            fontWeight: "bold",
            fontSize: "1.1rem",
            lineHeight: 1.3,
            marginBottom: "8px",
          }}
        >
          {book.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "rgba(255, 255, 255, 0.9)",
            lineHeight: 1.4,
          }}
        >
          by {book.author}
        </Typography>
      </CardContent>
    </Card>
  );
}
