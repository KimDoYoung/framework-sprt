package kr.co.kfs.asseterp.oms.biz.sys.mapper;

import kr.co.kfs.asseterp.oms.biz.sys.dto.CodeGroupKey;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CodeGroupRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CodeGroupRow;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SysCodeGroupMapper {
    Long selectNextId();

    CodeGroupRes selectById(Long codeGroupId);

    /** 코드종류의 그룹 정의 행 (codeId = 0) */
    List<CodeGroupRes> searchGroups(Long codeKindId);

    /** 그룹의 구성 코드 (codeId != 0, 회사 코드) */
    List<CodeGroupRes> searchGroupCodes(CodeGroupKey key);

    int insert(CodeGroupRow row);

    int update(CodeGroupRow row);

    /** 그룹 이름 변경: 같은 그룹(변경 전 코드·설명)의 모든 행 */
    int updateGroup(CodeGroupKey key);

    /** 그룹 삭제: 같은 그룹의 모든 행 */
    int deleteGroup(CodeGroupKey key);

    int delete(List<Long> codeGroupIds);
}
