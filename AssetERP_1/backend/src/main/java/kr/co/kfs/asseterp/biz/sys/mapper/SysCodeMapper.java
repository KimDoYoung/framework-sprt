package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.CodeAdminRes;
import kr.co.kfs.asseterp.biz.sys.dto.CodeAdminRow;
import kr.co.kfs.asseterp.biz.sys.dto.CodeDeleteParam;
import kr.co.kfs.asseterp.biz.sys.dto.CodeListParam;
import kr.co.kfs.asseterp.biz.sys.dto.CodeRes;
import kr.co.kfs.asseterp.biz.sys.dto.CodeSearchParam;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/sys/mapper/sys09_code.xml (공통코드 콤보) */
@Mapper
public interface SysCodeMapper {
    /** AS-IS selectByCodeKind */
    List<CodeRes> searchCodesByKind(CodeSearchParam param);

    // ── A13 Sys09_Grid_Code: 코드 관리 (AS-IS selectByCodeKindId, selectById + UpdateDataModel(sys09_code)) ──

    /** AS-IS selectByCodeKindId */
    List<CodeAdminRes> searchCodesByKindId(CodeListParam param);

    /** AS-IS selectById */
    CodeAdminRes selectCode(@Param("codeId") Long codeId);

    Long selectNextId();

    int insertCode(CodeAdminRow row);

    int updateCode(CodeAdminRow row);

    int deleteCodes(CodeDeleteParam param);

    /** AS-IS codeInsert (A14 코드복사): 원본 회사의 그 코드구분 코드를 새 회사로 INSERT … SELECT */
    int copyCodes(@Param("sourceCompanyId") Long sourceCompanyId, @Param("newCompanyId") Long newCompanyId,
                  @Param("codeKindId") Long codeKindId);
}
