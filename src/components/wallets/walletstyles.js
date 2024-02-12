import styled from "styled-components";

export const Button = styled.button`
  padding: 11px 53px;
  border-radius: 30px;
  border: 0px;
  background: #2042B8;
  font-weight: 600;
  color: ${({ theme }) => theme.white};
  &:disabled {
    background-color: ${({ theme }) => theme.disabledColor};
  }
`;


export const WalletOption = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  flex-direction: row;
  gap: 1rem;
  background-color: ${({ theme }) => theme.highlight2};
  margin-bottom: 1rem;
  padding: 0.5rem;
  cursor: pointer;
`;