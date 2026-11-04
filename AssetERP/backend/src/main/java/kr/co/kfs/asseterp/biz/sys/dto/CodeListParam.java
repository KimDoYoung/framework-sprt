package kr.co.kfs.asseterp.biz.sys.dto;

/** AS-IS sys09_code.selectByCodeKindId (searchText는 코드+코드명에 포함 검색, taskId는 법규 고르기(TdmLawCode) 때 그 직무에 이미 연결된 법규를 뺀다) */
public record CodeListParam(Long codeKindId, Long companyId, String searchText, Long taskId) {
    /** taskId 없이 (코드 관리 화면) */
    public CodeListParam(Long codeKindId, Long companyId, String searchText) {
        this(codeKindId, companyId, searchText, null);
    }

}
