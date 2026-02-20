# NobivaClient1

📝 Usage Examples
Check if user is logged in:

```sh
if (this.authService.isLoggedIn()) {
  // User is authenticated
}
```

Get user data:

```sh 
const email = this.authService.getEmail();
const roles = this.authService.getRoles();
```

Logout:
```sh
if (this.authService.hasRole('SUPER_ADMINSTRADOR')) {
  // Show admin features
}
```
Logout:
```sh
logout() {
  this.authService.logout();
  this.router.navigate(['/login']);
}
```

Protect routes by role:
```sh
{
  path: 'admin',
  component: AdminComponent,
  canActivate: [createRoleGuard(['SUPER_ADMINSTRADOR'])]
}
```

``````