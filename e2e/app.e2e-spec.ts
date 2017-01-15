import { SalaryStatsPage } from './app.po';

describe('salary-stats App', function() {
  let page = new SalaryStatsPage();

  beforeEach(() => {
    page.navigateTo();
  });

  it('should display application title', () => {
    expect(page.getTitleText()).toEqual('Salary statistics');
  });

  describe('person table', () => {
    it('should display default people', () => {
      expect(page.getPeople().count()).toBeGreaterThan(0);
      page.getNames().then(names => {
        expect(names[0]).toBe('Alice');
      });
    });

    it('should display name, salary, cohort and a delete button for each person', () => {
      expect(page.getHeaders()).toEqual(['Name', 'Salary', 'Cohort', 'Delete All']);
      expect(page.getFirstRow()).toEqual(['Alice', '£12,345', 'A', 'Delete']);
    });

    it('should allow a person to be deleted', () => {
      page.getPeople().count().then(initialCount => {
        page.deleteFirstRow();

        expect(page.getPeople().count()).toBe(initialCount - 1);
        expect(page.getFirstRow()).toEqual(['Bob', '£12,435', 'A', 'Delete']);
      });
    });

    it('should allow all people to be deleted', () => {
      expect(page.getPeople().count()).toBeGreaterThan(0);

      page.deleteAllRows();

      expect(page.getPeople().count()).toBe(0);
    });

    it('should allow a person to be added', () => {
      page.getPeople().count().then(initialCount => {
        page.addNewRow('Keira', 14532, 'C');

        expect(page.getPeople().count()).toBe(initialCount + 1);
        expect(page.getLastRow()).toEqual(['Keira', '£14,532', 'C', 'Delete']);
        expect(page.getNameInput().getId()).toBe(page.getActiveElement().getId());
      });
    });

    it('should allow a person to be added from the keyboard', () => {
      page.getPeople().count().then(initialCount => {
        page.addNewRowFromKeyboard('Keira', 14532, 'C');

        expect(page.getPeople().count()).toBe(initialCount + 1);
        expect(page.getLastRow()).toEqual(['Keira', '£14,532', 'C', 'Delete']);
        expect(page.getNameInput().getId()).toBe(page.getActiveElement().getId());
      });
    });

    it('should allow inputs to be cleared', () => {
      page.enterRow('Keira', 14532, 'C');
      expect(page.getCurrentInputs()).toEqual(['Keira', '14532', 'C']);

      page.clearInputs();

      expect(page.getCurrentInputs()).toEqual(['', '', '']);
    });
  });

  describe('salary chart', () => {
    it('should be displayed', () => {
      expect(page.getChart().isPresent()).toBe(true, 'chart is not present');
    });

    it('should display a box plot for each cohort', () => {
      expect(page.getCohortBoxPlots().count()).toBeGreaterThan(1);
    });

    it('should display a point for each outlier', () => {
      expect(page.getOutlierPoints().count()).toBeGreaterThan(0);
    });
  });

  describe('bulk upload', () => {
    it('should allow the user to replace everyone at once', () => {
      page.bulkUploadPeople('Alex,123,A', 'Bea,234,B');

      expect(page.getPeople().count()).toBe(2);
      expect(page.getFirstRow()).toEqual(['Alex', '£123', 'A', 'Delete']);
      expect(page.getCurrentInputs()).toEqual(['', '', '']);
    });

    it('should not allow the user to submit empty bulk data', () => {
      page.bulkUploadPeople();

      expect(page.getPeople().count()).toBeGreaterThan(0);
    });
  });
});
