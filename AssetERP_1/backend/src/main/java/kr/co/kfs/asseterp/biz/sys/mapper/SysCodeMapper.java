package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.CodeRes;
import kr.co.kfs.asseterp.biz.sys.dto.CodeSearchParam;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/** AS-IS server/sys/mapper/sys09_code.xml (공통코드 콤보) */
@Mapper
public interface SysCodeMapper {
    /** AS-IS selectByCodeKind */
    List<CodeRes> searchCodesByKind(CodeSearchParam param);
}
