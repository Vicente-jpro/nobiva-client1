import { ChangeDetectionStrategy, Component, inject, Output } from '@angular/core';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface FoodNode {
    name: string;
    children?: FoodNode[];
}

@Component({
    selector: 'app-house-tree',
    imports: [MatTreeModule, MatButtonModule, MatIconModule],
    templateUrl: './house-tree.html',
    styleUrl: './house-tree.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HouseTree {
    private router = inject(Router);
    dataSource = EXAMPLE_DATA;

    childrenAccessor = (node: FoodNode) => node.children ?? [];

    hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;

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

        console.log('Selected tree node:', name);

    }

}

const EXAMPLE_DATA: FoodNode[] = [
    {
        name: 'Casas',
        children: [{ name: 'Nova' }, { name: 'Listar' }, { name: 'Favoritas' }, { name: 'Minhas' }],
    },

];
