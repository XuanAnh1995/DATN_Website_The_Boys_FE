import React, { useEffect, useState } from "react";
import StatisticsService from "../../../../services/StatisticsService";
import { Card, CardContent } from "../components/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const YearlyRevenueChart = () => {
    const [yearlyRevenue, setYearlyRevenue] = useState([]);

    useEffect(() => {
        StatisticsService.getYearlyRevenue().then(res => {
            setYearlyRevenue(res.data.data);
        });
    }, []);

    return (
        <Card className="col-span-2">
            <CardContent>
                <h2 className="text-xl font-bold">Doanh thu theo năm</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={yearlyRevenue}>
                        <XAxis dataKey="yearNumber" />
                        <YAxis />
                        <Tooltip formatter={(value) => `${value.toLocaleString("vi-VN")} đ`} />
                        <Bar dataKey="yearlyRevenue" fill="#d88484" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default YearlyRevenueChart;
