"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GenreData {
  genre: string;
  count: number;
}

export function BooksPerGenreChart() {
  const [data, setData] = useState<GenreData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [primaryColor, setPrimaryColor] = useState<string>("#000000");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/books/books-per-genre");
        setData(response.data);
      } catch {
        console.error("Failed to fetch books per genre data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const root = document.documentElement;
    const primaryHsl = getComputedStyle(root)
      .getPropertyValue("--primary")
      .trim();
    if (primaryHsl) {
      const [h, s, l] = primaryHsl.split(" ").map((v) => v.replace("%", ""));
      setPrimaryColor(`hsl(${h}, ${s}%, ${l}%)`);
    }
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Books per Genre</CardTitle>
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
          <CardTitle>Books per Genre</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-80">
            <p className="text-muted-foreground">No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Books per Genre</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="genre"
              angle={-45}
              textAnchor="end"
              height={100}
              className="text-xs"
            />
            <YAxis className="text-xs" allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "#000000",
              }}
              labelStyle={{ color: "#000000" }}
              itemStyle={{ color: "#000000" }}
            />
            <Legend />
            <Bar
              dataKey="count"
              fill="#dea95d"
              name="Number of Books"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
