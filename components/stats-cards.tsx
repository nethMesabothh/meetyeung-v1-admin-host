import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, DollarSign, ShoppingCart, Activity } from 'lucide-react';

const stats = [
  {
    title: 'Total Revenue',
    value: '$45,231.89',
    change: '+20.1%',
    changeType: 'positive' as const,
    icon: DollarSign,
  },
  {
    title: 'Active Users',
    value: '2,350',
    change: '+180.1%',
    changeType: 'positive' as const,
    icon: Users,
  },
  {
    title: 'Sales',
    value: '12,234',
    change: '+19%',
    changeType: 'positive' as const,
    icon: ShoppingCart,
  },
  {
    title: 'Conversion Rate',
    value: '3.24%',
    change: '-4.5%',
    changeType: 'negative' as const,
    icon: Activity,
  },
];

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              {stat.changeType === 'positive' ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
              )}
              <span className={stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}>
                {stat.change}
              </span>
              <span className="ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}