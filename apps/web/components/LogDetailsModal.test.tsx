import { render, screen, fireEvent } from '@testing-library/react'
import { LogDetailsModal } from './LogDetailsModal'
import { describe, it, expect, vi } from 'vitest'

describe('LogDetailsModal', () => {
  const mockLog = {
    id: 'test-id',
    status: 'success',
    startedAt: new Date().toISOString(),
    finishedAt: new Date().toISOString(),
    trace: {
      input: { foo: 'bar' },
      output: { baz: 'qux' }
    }
  }

  const mockOnClose = vi.fn()

  it('renders correctly with success status', () => {
    render(<LogDetailsModal log={mockLog} onClose={mockOnClose} />)
    
    expect(screen.getByText(/test-id/i)).toBeDefined()
    expect(screen.getByText(/Input Payload/i)).toBeDefined()
    expect(screen.getByText(/Output Data/i)).toBeDefined()
    expect(screen.getByText(/"foo": "bar"/)).toBeDefined()
    expect(screen.getByText(/"baz": "qux"/)).toBeDefined()
  })

  it('renders correctly with failed status and error message', () => {
    const failedLog = {
      ...mockLog,
      status: 'failed',
      error: 'Something went wrong'
    }
    render(<LogDetailsModal log={failedLog} onClose={mockOnClose} />)
    
    expect(screen.getByText(/Error/i)).toBeDefined()
    expect(screen.getByText(/Something went wrong/i)).toBeDefined()
    // Output Data should not be shown for failed logs (based on component logic)
    expect(screen.queryByText(/Output Data/i)).toBeNull()
  })

  it('calls onClose when close button is clicked', () => {
    render(<LogDetailsModal log={mockLog} onClose={mockOnClose} />)
    
    const closeButton = screen.getByRole('button')
    fireEvent.click(closeButton)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })
})
