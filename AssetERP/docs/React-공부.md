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

## 초기화 버튼 제거

* 사원찾기 모달 파일: AssetERP/frontend/src/components/lookup/Emp00_Lookup_SelectSingle.tsx (다중
  선택판은 Emp00_Lookup_SelectMulti.tsx).

  초기화 버튼은 109행 SearchBar의 onReset prop이 만든다. 이 prop을 빼면 버튼이 사라진다(11 §2: onReset이
  없으면 초기화 버튼 없음).
```
  // 변경 전 (109행)
  <SearchBar onSearch={() => retrieve(baseDate, findText, transName)} onReset={() =>
  sp.setValues(openValues)}>

  // 변경 후
  <SearchBar onSearch={() => retrieve(baseDate, findText, transName)}>
```

  이후 정리할 것:
  - openValues는 onReset에서만 썼다면 안 쓰는 변수가 된다. 다른 곳에서 쓰는지 확인하고, 안 쓰면 tsc가
    경고하기 전에 지운다.
  - 6행 파일 머리 주석("UX-01·02·04, 초기화는 열 때 값")과 52행 주석("초기화는 openValues로 한다")도
    맞춰서 고친다.
  - 이 부품은 Flt10_Tab_TrListAdmin, Flt11_Tab_BookListAdmin 같은 다른 화면의 사원찾기도 함께 쓴다.
    초기화 버튼은 전부 사라진다.