# FRC758

FRC758 is a time-slicing smart contract standard on the Fusion blockchain.

That different from ERC20 tokens in that it supports time slicing.

### What is time slicing?

Every FRC758 token adds start time and end time attributes. Only the tokens whose current time is within the start time and end time are valid tokens.

### For example

There are 10 tokens from T3 to T5 in the account, The amount of the account received from T2 time to T4 time is 2 coins, And the amount from T4 to T6 is 4 coins.

In this case, the amount from T2 to T3 is 2, the amount from T3 to T4 is 12, the amount from T4 to T5 is 14, and the amount from T5 to T6 is 4.

```
        
        T3              T5
        |-------10-----|
           
     T2        T4             T6
    |-----2----|---------4----|

            Merge into 

    |-2-|---12-|--14---|--4---|

```

### Important API



#### Mint

The mint method adds tokenStart and tokenEnd on the basis of erc20, representing the start time and end time of the token

```solidity
    function _mint(address _from,  uint256 amount, uint256 tokenStart, uint256 tokenEnd);
```

### Burn

```solidity
    function _burn(address _owner, uint256 amount, uint256 tokenStart, uint256 tokenEnd);
```

#### TransferFrom

Added start time and end time

```solidity
    function safeTransferFrom(address _from, address _to, uint256 amount, uint256 tokenStart, uint256 tokenEnd) 
```

#### BalanceOf

Added start time and end time

```solidity
    function balanceOf(address from, uint256 tokenStart, uint256 tokenEnd) public override view returns(uint256) 
```

### Deploy

```shell
npm i

# deplay localhost
npm deploy

```
If you need deploy to other, please edit this file scripts/sample-script.ts

### Test

```shell
npm test
```