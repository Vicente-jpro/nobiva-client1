import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

interface NavNode {
  name: string;
  icon?: string;
  adminOnly?: boolean;
  children?: NavNode[];
}

@Component({
  selector: 'app-house-tree',
  imports: [],
  templateUrl: './house-tree.html',
  styleUrl: './house-tree.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HouseTree {
  private router = inject(Router);
  user = inject(AuthService);
  expandedNodes = new Set<string>();

  get dataSource(): NavNode[] {
    const isAdmin = this.user.hasAnyRole(['ADMINSTRADOR', 'SUPER_ADMINSTRADOR']);
    return TREE_DATA.filter(n => !n.adminOnly || isAdmin);
  }

  toggle(name: string): void {
    if (this.expandedNodes.has(name)) {
      this.expandedNodes.delete(name);
    } else {
      this.expandedNodes.add(name);
    }
  }

  isExpanded(name: string): boolean {
    return this.expandedNodes.has(name);
  }

  navigate(name: string): void {
    const routes: Record<string, string> = {
      // Casas
      'Nova': '/menu/casas/nova',
      'Listar': '/menu/casas',
      'Favoritas': '/menu/casas/favoritas',
      'Minhas': '/menu/casas/minhas',
      // Planos
      'Gerir Planos': '/menu/planos',
      // Subscrições
      'Pendentes': '/menu/subscricoes',
      'Minha Subscrição': '/menu/minha-subscricao',
    };
    const path = routes[name];
    if (path) this.router.navigate([path]);
  }
}

const TREE_DATA: NavNode[] = [
  {
    name: 'Casas',
    icon: 'bi-houses',
    children: [
      { name: 'Nova', icon: 'bi-plus-circle' },
      { name: 'Listar', icon: 'bi-list-ul' },
      { name: 'Favoritas', icon: 'bi-heart' },
      { name: 'Minhas', icon: 'bi-person-check' },
    ],
  },
  {
    name: 'Planos',
    icon: 'bi-patch-check',
    adminOnly: true,
    children: [
      { name: 'Gerir Planos', icon: 'bi-sliders' },
    ],
  },
  {
    name: 'Subscrições',
    icon: 'bi-credit-card-2-front',
    children: [
      { name: 'Minha Subscrição', icon: 'bi-person-badge' },
      { name: 'Pendentes', icon: 'bi-hourglass-split', adminOnly: true },
    ],
  },
];
