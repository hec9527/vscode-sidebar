import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

type IData = {
    code: string;
    name: string;
    children?: IData[];
};

/**
 * 数据提供者 必须实现
 *  - getTreeItem
 *  - getChildren
 */
export class CountryProvider implements vscode.TreeDataProvider<Country> {
    private data: IData[] = [];

    constructor(private filePath: string) {
        console.log('%c filepath:', 'color:pink', filePath);
        if (!pathExists(filePath)) {
            throw new Error('file not exists');
        } else {
            this.data = JSON.parse(fs.readFileSync(this.filePath, 'utf-8'));
            console.log('省市县行政区划，侧边栏已启动');
        }
    }

    getTreeItem(element: Country): vscode.TreeItem {
        return element;
    }

    getChildren(element?: Country): Thenable<Country[]> {
        if (!element) {
            return Promise.resolve(this.parseData(this.data));
        }
        if (element.children) {
            return Promise.resolve(this.parseData(element.children));
        }
        return Promise.resolve([]);
    }
    parseData(data: IData[]) {
        return data.map(item => {
            return new Country(
                item.name,
                item.code,
                this.getFullLocation(item),
                item.children ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None,
                item.children
            );
        });
    }

    getFullLocation({ code, name, children }: IData) {
        const provinceNum = code.slice(0, 2);
        const cityNum = code.slice(0, 4);
        const countryNum = code.slice(0, 6);
        let location = '';
        this.data
            .find(p => {
                if (p.code === provinceNum) {
                    location += p.name;
                    return true;
                }
            })
            ?.children?.find(c => {
                if (c.code === cityNum) {
                    location += c.name;
                    return true;
                }
            })
            ?.children?.find(d => {
                if (d.code === countryNum) {
                    location += d.name;
                }
            });
        if (!children) {
            location += name;
        }

        return location;
    }
}

class Country extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public description: string, // code
        public tooltip: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public children?: IData[]
    ) {
        super(label, collapsibleState);

        const place = {
            2: '省份',
            4: '城市',
            6: '县城',
        }[this.description.length];

        this.setIconPath(place || '乡村');
    }

    setIconPath(name: string) {
        this.iconPath = {
            light: path.join(__dirname, `../src/svg/${name}.svg`),
            dark: path.join(__dirname, `../src/svg/${name}-light.svg`),
        };
    }
}

function pathExists(p: string): boolean {
    try {
        fs.accessSync(p);
    } catch (err) {
        return false;
    }
    return true;
}
