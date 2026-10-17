package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.CodeKindRes;
import kr.co.kfs.asseterp.biz.sys.dto.CodeKindSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.CodeKindSearchParam;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/sys/mapper/sys08_code_kind.xml (selectByKindName, selectById) + UpdateDataModel(sys08_code_kind) */
@Mapper
public interface SysCodeKindMapper {
    List<CodeKindRes> searchCodeKinds(CodeKindSearchParam param);

    CodeKindRes selectCodeKind(@Param("codeKindId") Long codeKindId);

    /** AS-IS sys08_code_kind.selectByKindCode */
    CodeKindRes selectByKindCode(@Param("kindCode") String kindCode);

    Long selectNextId();

    int insertCodeKind(CodeKindSaveReq req);

    int updateCodeKind(CodeKindSaveReq req);

    int deleteCodeKinds(@Param("codeKindIds") List<Long> codeKindIds);
}
