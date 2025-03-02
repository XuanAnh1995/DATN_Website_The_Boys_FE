import React, { useEffect, useState } from "react";
import StatisticsService from "../../../../services/StatisticsService";
import { Card, CardContent } from "../components/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const WeeklyRevenueChart = () => {
    const [weeklyRevenue, setWeeklyRevenue] = useState([]);

    useEffect(() => {
        StatisticsService.getWeeklyRevenue().then(res => {
            const formattedData = res.data.data.map(item => ({
                week: `Tuần ${item.weekNumber}`,
                revenue: item.weeklyRevenue
            }));
            setWeeklyRevenue(formattedData);
        });
    }, []);

    return (
        <Card className="col-span-2">
            <CardContent>
                <h2 className="text-xl font-bold">Doanh thu theo tuần</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weeklyRevenue}>
                        <XAxis dataKey="week" />
                        <YAxis />
                        <Tooltip formatter={(value) => `${value.toLocaleString("vi-VN")} đ`} />
                        <Bar dataKey="revenue" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default WeeklyRevenueChart;
