"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GenreData {
  genre: string;
  count: number;
}

const COLORS = [
  "#dea95d",
  "#8b7355",
  "#c4a57b",
  "#a67c52",
  "#d4af37",
  "#b8956a",
  "#9d7e5a",
  "#e6c79c",
];

export default function GenreDistributionChart({ userId }: { userId: string }) {
  const [data, setData] = useState<GenreData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/stats/genre-distribution", {
          params: { userId },
        });
        setData(response.data);
      } catch {
        console.error("Failed to fetch genre distribution");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Genre Distribution by Books Read</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-80">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Genre Distribution by Books Read</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-80">
            <p className="text-muted-foreground">No books read yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Genre Distribution by Books Read</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ genre, percent }) =>
                `${genre}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={120}
              fill="#8884d8"
              dataKey="count"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "#000000",
              }}
              itemStyle={{ color: "#000000" }}
            />
            <Legend
              formatter={(value, entry) => {
                const payload = entry.payload as unknown as GenreData;
                return payload.genre;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
