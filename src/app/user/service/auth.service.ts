import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UserLoginResponse } from '../model/userLoginResponse';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  
  /**
   * Store authentication data in localStorage
   */
  saveAuthData(response: UserLoginResponse): void {
    if (!this.isBrowser) return;
    
    localStorage.setItem('token', response.token);
    localStorage.setItem('tokenType', response.type);
    localStorage.setItem('username', response.username);
    localStorage.setItem('email', response.email);
    localStorage.setItem('roles', JSON.stringify(response.roles));
  }

  /**
   * Get the stored authentication token
   */
  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('token');
  }

  /**
   * Get the token type (e.g., "Bearer")
   */
  getTokenType(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('tokenType');
  }

  /**
   * Get the full authorization header value
   */
  getAuthorizationHeader(): string | null {
    const token = this.getToken();
    const type = this.getTokenType();
    
    if (token && type) {
      return `${type} ${token}`;
    }
    return null;
  }

  /**
   * Get the stored username
   */
  getUsername(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('username');
  }

  /**
   * Get the stored email
   */
  getEmail(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('email');
  }

  /**
   * Get the stored user roles
   */
  getRoles(): string[] {
    if (!this.isBrowser) return [];
    
    const rolesString = localStorage.getItem('roles');
    if (rolesString) {
      try {
        return JSON.parse(rolesString);
      } catch (error) {
        console.error('Error parsing roles:', error);
        return [];
      }
    }
    return [];
  }

  /**
   * Check if user is logged in (has a token)
   */
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Check if user has a specific role
   */
  hasRole(role: string): boolean {
    const roles = this.getRoles();
    return roles.includes(role);
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    const userRoles = this.getRoles();
    return roles.some(role => userRoles.includes(role));
  }

  /**
   * Check if user has all of the specified roles
   */
  hasAllRoles(roles: string[]): boolean {
    const userRoles = this.getRoles();
    return roles.every(role => userRoles.includes(role));
  }

  /**
   * Clear all authentication data (logout)
   */
  logout(): void {
    if (!this.isBrowser) return;
    
    localStorage.removeItem('token');
    localStorage.removeItem('tokenType');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('roles');
  }

  /**
   * Get all auth data as an object
   */
  getAuthData(): UserLoginResponse | null {
    const token = this.getToken();
    
    if (!token) {
      return null;
    }

    return {
      token: token,
      type: this.getTokenType() || '',
      username: this.getUsername() || '',
      email: this.getEmail() || '',
      roles: this.getRoles()
    };
  }
}
