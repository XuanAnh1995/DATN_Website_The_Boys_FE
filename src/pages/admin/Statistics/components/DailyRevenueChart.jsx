import React, { useEffect, useState } from "react";
import StatisticsService from "../../../../services/StatisticsService";
import { Card, CardContent } from "../components/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const DailyRevenueChart = () => {
    const [dailyRevenue, setDailyRevenue] = useState([]);

    useEffect(() => {
        StatisticsService.getDailyRevenue().then(res => {
            const formattedData = res.data.data.map(item => ({
                date: `${item.dayNumber}/${item.monthNumber}/${item.yearNumber}`,
                revenue: item.dailyRevenue
            }));
            setDailyRevenue(formattedData);
        });
    }, []);

    return (
        <Card className="col-span-2">
            <CardContent>
                <h2 className="text-xl font-bold">Doanh thu theo ngày</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dailyRevenue}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value) => `${value.toLocaleString("vi-VN")} đ`} />
                        <Bar dataKey="revenue" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default DailyRevenueChart;
