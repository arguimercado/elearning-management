


export const ROUTES = {
   DASHBOARD: "/admin/dashboard",
   COURSE_LIST: '/admin/courses',
   COURSE_CREATE: '/admin/courses/create',
   COURSE_EDIT: (id:string) => `/admin/courses/${id}/edit`,
   COURSE_VIEW: (id:string) => `/admin/courses/${id}/view`,
   DASHBOARD_PROFILE: '/admin/profile',
   DASHBOARD_SETTINGS: '/admin/settings',
   AUTH_SIGN_IN: "/auth/sign-in",
   AUTH_SIGN_OUT: "/auth/sign-out",
}
