package kr.co.kfs.asseterp.oms.biz.sys.mapper;

import kr.co.kfs.asseterp.oms.biz.sys.dto.CodeCopyParam;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CodeByKindParam;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CodeDeleteParam;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CodeRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CodeRow;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CodeSearchParam;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SysCodeMapper {
    Long selectNextId();

    CodeRes selectById(Long codeId);

    /** 코드종류의 코드 (시스템 코드종류면 회사 0) */
    List<CodeRes> searchByCodeKindId(CodeSearchParam param);

    int insert(CodeRow row);

    /** 회사 조건 포함 — 다른 회사 코드는 0건 */
    int update(CodeRow row);

    int delete(CodeDeleteParam param);

    /** 원본 회사의 코드종류 코드를 새 회사로 복사 */
    int copy(CodeCopyParam param);

    /** 신규 고객사에 KFS 기본(회사 0) 비시스템 코드를 넣는다 (AS-IS sys09_code.insertFromSys09) */
    int insertCompanyDefaults(Long companyId);

    /** 콤보용: 코드종류 코드값으로 기준일 유효 코드 (AS-IS sys09_code.selectByCodeKind) */
    List<CodeRes> searchByKindCd(CodeByKindParam param);
}
