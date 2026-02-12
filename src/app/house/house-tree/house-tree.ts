import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatTreeModule} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

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

  childrenAccessor = (node: FoodNode) => node.children ?? [];

  hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;
}

const EXAMPLE_DATA: FoodNode[] = [
  {
    name: 'Casas',
    children: [{name: 'Nova'}, {name: 'Listar'}],
  },

];
