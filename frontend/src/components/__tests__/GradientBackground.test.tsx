import { render } from '../../test-utils';
import GradientBackground from '../GradientBackground';

describe('GradientBackground Component', () => {
  test('renders without crashing', () => {
    const { container } = render(<GradientBackground />);
    expect(container).toBeInTheDocument();
  });

  test('creates background box element', () => {
    const { container } = render(<GradientBackground />);
    const boxElement = container.firstChild;
    expect(boxElement).toHaveStyle({ position: 'fixed' });
  });
}); 