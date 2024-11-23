import { render, screen } from '../../test-utils';
import Footer from '../Footer';

describe('Footer Component', () => {
  test('renders footer content', () => {
    render(<Footer />);
    expect(screen.getByText(/zenalyx/i)).toBeInTheDocument();
  });

  test('displays current year', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
  });

  test('shows copyright text', () => {
    render(<Footer />);
    expect(screen.getByText(/all rights reserved/i)).toBeInTheDocument();
  });
}); 