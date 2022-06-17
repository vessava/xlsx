interface Employee {
  name: string;
  depart: string;
}

export class ClassifyStatistics {
  private readonly countMap = new Map<string, number>();
  private total: number = 0;

  add(employee: Employee) {
    const depart = employee.depart;
    this.addCount(depart);
  }

  private addCount(depart: string) {
    const count = this.countMap.get(depart) || 0;
    this.countMap.set(depart, count + 1);
    this.total++;
  }

  getStatistics() {
    return {
      countMap: this.countMap,
      total: this.total,
    };
  }
}
