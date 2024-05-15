import { Card, LineChart, FunnelChart } from "@tremor/react";

const dataFormatter = (number: number): string =>
  `$${Intl.NumberFormat("us").format(number).toString()}`;

const AgencyDashboard = () => {
  const chartdata = [
    {
      date: "Jan 22",
      SemiAnalysis: 2890,
      "The Pragmatic Engineer": 2338,
    },
    {
      date: "Feb 22",
      SemiAnalysis: 2756,
      "The Pragmatic Engineer": 2103,
    },
    {
      date: "Mar 22",
      SemiAnalysis: 3322,
      "The Pragmatic Engineer": 2194,
    },
    {
      date: "Apr 22",
      SemiAnalysis: 3470,
      "The Pragmatic Engineer": 2108,
    },
    {
      date: "May 22",
      SemiAnalysis: 3475,
      "The Pragmatic Engineer": 1812,
    },
    {
      date: "Jun 22",
      SemiAnalysis: 3129,
      "The Pragmatic Engineer": 1726,
    },
    {
      date: "Jul 22",
      SemiAnalysis: 3490,
      "The Pragmatic Engineer": 1982,
    },
    {
      date: "Aug 22",
      SemiAnalysis: 2903,
      "The Pragmatic Engineer": 2012,
    },
    {
      date: "Sep 22",
      SemiAnalysis: 2643,
      "The Pragmatic Engineer": 2342,
    },
    {
      date: "Oct 22",
      SemiAnalysis: 2837,
      "The Pragmatic Engineer": 2473,
    },
    {
      date: "Nov 22",
      SemiAnalysis: 2954,
      "The Pragmatic Engineer": 3848,
    },
    {
      date: "Dec 22",
      SemiAnalysis: 3239,
      "The Pragmatic Engineer": 3736,
    },
  ];

  const funnelChartdata = [
    { name: "1. Add credit Card", value: 89 },
    { name: "2. Copy invite code", value: 6 },
    {
      name: "3. Send invite code",
      value: 5,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card title="Sales Performance">
        <LineChart
          className="h-80"
          data={chartdata}
          index="date"
          categories={["SemiAnalysis", "The Pragmatic Engineer"]}
          colors={["indigo", "rose"]}
          valueFormatter={dataFormatter}
          yAxisWidth={60}
          onValueChange={(v) => console.log(v)}
        />
      </Card>
      <Card title="Sales Performance">
        <h3 className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
          Overall conversion
        </h3>
        <p className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
          5.6%
        </p>
        <p className="mt-4 text-tremor-label text-tremor-content dark:text-dark-tremor-content">
          Uniques in specific order, who converted within 30 days.
        </p>
        <FunnelChart className="mt-4 h-60" data={funnelChartdata} />
      </Card>
    </div>
  );
};

export default AgencyDashboard;
