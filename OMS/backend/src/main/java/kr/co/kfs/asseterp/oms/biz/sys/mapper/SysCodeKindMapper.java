package kr.co.kfs.asseterp.oms.biz.sys.mapper;

import kr.co.kfs.asseterp.oms.biz.sys.dto.CodeKindRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CodeKindRow;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CodeKindSearchParam;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SysCodeKindMapper {
    Long selectNextId();

    CodeKindRes selectById(Long codeKindId);

    List<CodeKindRes> searchByKindName(CodeKindSearchParam param);

    int insert(CodeKindRow row);

    int update(CodeKindRow row);

    int delete(List<Long> codeKindIds);
}
