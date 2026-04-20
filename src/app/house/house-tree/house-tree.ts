import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

interface FoodNode {
  name: string;
  children?: FoodNode[];
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
  dataSource = EXAMPLE_DATA;
  expandedNodes = new Set<string>();

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

  sendSelectedTreeToHouse(name: string): void {
    switch (name) {
      case 'Nova':
        this.router.navigate(['/menu/casas/nova']);
        break;
      case 'Favoritas':
        this.router.navigate(['/menu/casas/favoritas']);
        break;
      case 'Minhas':
        this.router.navigate(['/menu/casas/minhas']);
        break;
      default:
        this.router.navigate(['/menu/casas']);
    }
  }
}

const EXAMPLE_DATA: FoodNode[] = [
  {
    name: 'Casas',
    children: [{ name: 'Nova' }, { name: 'Listar' }, { name: 'Favoritas' }, { name: 'Minhas' }],
  },
];
