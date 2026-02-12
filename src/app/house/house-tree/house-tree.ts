import { ChangeDetectionStrategy, Component, Output } from '@angular/core';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EventEmitter } from '@angular/core';

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

    dataSource = EXAMPLE_DATA;

    @Output() selectedHouseTreeEvent = new EventEmitter<string>();

    childrenAccessor = (node: FoodNode) => node.children ?? [];

    hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;

    sendSelectedTreeToHouse(name: string): void {
        this.selectedHouseTreeEvent.emit(name);
        console.log('Selected tree node:', name);
    }

}

const EXAMPLE_DATA: FoodNode[] = [
    {
        name: 'Casas',
        children: [{ name: 'Nova' }, { name: 'Listar' }],
    },

];
