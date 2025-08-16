import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  TrendingUp,
  DollarSign,
  Activity,
  UserCheck,
  AlertCircle
} from "lucide-react";

const Dashboard = async () => {
   const session = await auth.api.getSession({
      headers: await headers(),
   });

   // Sample data for dashboard cards
   const stats = {
      totalStudents: 1247,
      totalTeachers: 85,
      totalCourses: 42,
      totalRevenue: 125000,
      activeStudents: 1180,
      completionRate: 87,
   };

   const recentActivities = [
      { 
         id: 1, 
         type: "enrollment", 
         message: "New student John Doe enrolled in Computer Science",
         time: "2 minutes ago"
      },
      { 
         id: 2, 
         type: "payment", 
         message: "Payment of $500 received from Jane Smith",
         time: "1 hour ago"
      },
      { 
         id: 3, 
         type: "course", 
         message: "Mathematics course updated by Prof. Johnson",
         time: "3 hours ago"
      },
      { 
         id: 4, 
         type: "grade", 
         message: "Grades published for Physics course",
         time: "5 hours ago"
      },
   ];

   return (
      <div className="space-y-6">
         {/* Welcome Section */}
         <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
               {session ? `Welcome back, ${session.user.name}!` : 'Welcome to EMS Admin Dashboard'}
            </p>
         </div>

         {/* Stats Cards */}
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                     <span className="text-green-600">+12%</span> from last month
                  </p>
               </CardContent>
            </Card>

            <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">{stats.totalTeachers}</div>
                  <p className="text-xs text-muted-foreground">
                     <span className="text-green-600">+2</span> new this month
                  </p>
               </CardContent>
            </Card>

            <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCourses}</div>
                  <p className="text-xs text-muted-foreground">
                     <span className="text-blue-600">5</span> courses added this week
                  </p>
               </CardContent>
            </Card>

            <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                     <span className="text-green-600">+8%</span> from last month
                  </p>
               </CardContent>
            </Card>
         </div>

         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Recent Activities */}
            <Card className="col-span-4">
               <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>
                     Latest activities across your education management system
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  <div className="space-y-4">
                     {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-center space-x-4">
                           <div className="w-2 h-2 bg-blue-500 rounded-full" />
                           <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium leading-none">
                                 {activity.message}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                 {activity.time}
                              </p>
                           </div>
                        </div>
                     ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                     View All Activities
                  </Button>
               </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="col-span-3">
               <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                  <CardDescription>
                     Important metrics at a glance
                  </CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="space-y-2">
                     <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Active Students</span>
                        <span className="text-sm text-muted-foreground">
                           {stats.activeStudents}/{stats.totalStudents}
                        </span>
                     </div>
                     <Progress value={(stats.activeStudents / stats.totalStudents) * 100} />
                  </div>

                  <div className="space-y-2">
                     <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Course Completion</span>
                        <span className="text-sm text-muted-foreground">{stats.completionRate}%</span>
                     </div>
                     <Progress value={stats.completionRate} />
                  </div>

                  <div className="pt-2 space-y-2">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                           <UserCheck className="h-4 w-4 text-green-500" />
                           <span className="text-sm">Online Users</span>
                        </div>
                        <Badge variant="secondary">247</Badge>
                     </div>

                     <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                           <AlertCircle className="h-4 w-4 text-orange-500" />
                           <span className="text-sm">Pending Reviews</span>
                        </div>
                        <Badge variant="destructive">12</Badge>
                     </div>

                     <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                           <Activity className="h-4 w-4 text-blue-500" />
                           <span className="text-sm">System Status</span>
                        </div>
                        <Badge className="bg-green-500">Healthy</Badge>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Quick Actions */}
         <Card>
            <CardHeader>
               <CardTitle>Quick Actions</CardTitle>
               <CardDescription>
                  Frequently used actions for efficient management
               </CardDescription>
            </CardHeader>
            <CardContent>
               <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                  <Button className="h-20 flex-col space-y-2" variant="outline">
                     <GraduationCap className="h-6 w-6" />
                     <span>Add Student</span>
                  </Button>
                  <Button className="h-20 flex-col space-y-2" variant="outline">
                     <Users className="h-6 w-6" />
                     <span>Add Teacher</span>
                  </Button>
                  <Button className="h-20 flex-col space-y-2" variant="outline">
                     <BookOpen className="h-6 w-6" />
                     <span>Create Course</span>
                  </Button>
                  <Button className="h-20 flex-col space-y-2" variant="outline">
                     <TrendingUp className="h-6 w-6" />
                     <span>View Reports</span>
                  </Button>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}

export default Dashboard;
