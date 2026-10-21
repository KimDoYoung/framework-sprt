# react 공부

## 개요

vscode에서 고칠 때 각 경우마다 코드를 어떻게 고쳐야하는지 방법을 기술


## 각 경우마다 코드 수정

- grid 컬럼 fix

```ts
    gb.text('accountNo', 200, '계좌', {pinned: 'left'}),
```
- 페이지 뜨면서 조회
```ts
  useEffect(() => {
    const initDate = dayjs().startOf('month').subtract(1, 'day').format(DATE_FORMAT);
    fltApi.getBizDate(initDate)
      .then(d => {
        const base = d ? dayjs(d) : dayjs(initDate);   // 영업일을 못 받으면 전월 말일로
        setBaseDate(base);
        paramRef.current = { ...paramRef.current, baseDate: base };   // ★ 이 줄이 핵심
        void retrieve();
      })
      .catch(() => undefined);
  }, [retrieve]);
```
