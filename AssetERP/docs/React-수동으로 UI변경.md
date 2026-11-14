# react 수동으로 UI변경

## 개요

vscode에서 고칠 때 각 경우마다 코드를 어떻게 고쳐야하는지 방법을 기술


## 변경 요청

공통
    - 페이지가 처음 open할때는 무조건 조회를 할까?
    - 2줄 header를 갖는 grid의 높이를 줄이면 좋겠고 

1002
    - 검색어 input 입력하고 ctrl+del -> 검색어가 삭제되고 찾기 즉 모두나오게 (검색어ctrl+del)
1014
    -왼쪽 찾기 버튼 옆에 TreeListControlButtons 붙이기, 검색어넣고 엔터 리스트로 보이기
    -왼쪽 트리 종말노트에는 문서icon앞에 붙이기
    
1443
    - 돋보기 클릭하면 '폐기된 문서...'라고 못 보여주는데. 돋보기 대신 '폐기'badge를 보여주면 좋을듯. red계통
    - 즉 내 말은 볼 수 있는 것만 돋보기
    

1326
    - 다운로드 버튼이 가능할때만 enable되면 좋을 듯. 즉 check된 것의 파일갯수가 0보다 크면 enable 그 전에는 disable
    - 그리고 같은 색깔 즉 '다운로드'와 '기록보기' 가 모두 오렌지 색임. 둘 중 1개를 다른 색으로 하자.(뭐가 좋은지 추천)
    
    
    
1490
    - 돋보기 누르면 '폐기된...' 볼 수 없는 row에 돋보기는 그렇치 않나? 어떤 상태에서 돋보기가 필요한지 판단해서 

    
1007
    - 구분추가 모달 에서 클릭하면 편집하게(더블클릭이 아니고)
    - 상세보기가 모니터 중앙에서 조금 위에 떴으면 좋겠음. 너무 중앙이면 사람이 보기에 아랫쪽에 뜨는 듯이 보임.
    - 상세보기->미리보기-> PDF를 Viewer를 못 만들었다고 오류남. 이것을 AView를 통해서 해결하면 어떨까? <- 3-재설계에 해당함

1116
    - 등록 클릭: 하단에 입력란이 생기면서 선택된 것처럼 체크박스도 체크되고 붉은색 바탕으로 바뀌면 인식이 쉬울 듯.
    - 파일업로드 버튼이 vertical 공간을 잡아 먹는데 어디 적당한 곳에 둘 수 없나?
    
Org10_Lookup_RoleStamp.tsx 에 TreeListControlButtons을 적용하면 좋겠음. 유사하게 tree가 대상일때


---


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

## SGEF (SearchGridEditForm)

- splitter fix
- search area box 제거
- search area y 축 간격
- edit area label 오른쪽 맞춤
- edit area row y 축 간격

```tsx
// size 동일하게
<Splitter.Panel defaultSize={350} min={350} max={900}>

// boarder 제거
<div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
  <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>


//textAlign: 'right', paddingRight: 8,
/** 칸 하나: 라벨(폭 105) + 입력. 줄 안에서 폭 350(2칸짜리는 700), 오른쪽 여백 50 */
const Cell: React.FC<{ label: string; required?: boolean; width?: number; align?: 'center' | 'flex-start'; children: React.ReactNode }> = ({
  label, required, width = 350, align = 'center', children,
}) => (
  <div style={{ width, marginRight: 50, display: 'flex', alignItems: align, flexShrink: 0 }}>
    <label style={{ width: 105, flexShrink: 0, textAlign: 'right', paddingRight: 8, color: required ? BLUE : undefined }}>{label}</label>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

//margin: '8px 20px 8px 20px'
const Row: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: 'flex', margin: '8px 20px 8px 20px' }}>{children}</div>
);


```

## 모달  헤더에 라인

```ts
styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 10 } }}
```