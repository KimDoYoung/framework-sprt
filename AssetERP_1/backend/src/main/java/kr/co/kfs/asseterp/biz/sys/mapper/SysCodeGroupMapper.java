package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.CodeGroupKeyParam;
import kr.co.kfs.asseterp.biz.sys.dto.CodeGroupMemberParam;
import kr.co.kfs.asseterp.biz.sys.dto.CodeGroupRenameParam;
import kr.co.kfs.asseterp.biz.sys.dto.CodeGroupRes;
import kr.co.kfs.asseterp.biz.sys.dto.CodeGroupRow;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/sys/mapper/sys13_code_group.xml + UpdateDataModel(sys13_code_group) */
@Mapper
public interface SysCodeGroupMapper {
    /** AS-IS selectByGroupCodeKind: 그룹 헤더(code_id = 0) */
    List<CodeGroupRes> searchGroups(@Param("codeKindId") Long codeKindId);

    /** AS-IS selectByKindGroupCode: 그룹에 속한 코드 */
    List<CodeGroupRes> searchMembers(CodeGroupMemberParam param);

    /** AS-IS selectById */
    CodeGroupRes selectGroup(@Param("codeGroupId") Long codeGroupId);

    Long selectNextId();

    /** AS-IS sys13_code_group.insert */
    int insertGroup(CodeGroupRow row);

    /** AS-IS sys13_code_group.update: 옛 그룹코드·설명이 같은 모든 행 */
    int renameGroup(CodeGroupRenameParam param);

    /** AS-IS sys13_code_group.delete: 코드구분·그룹코드·그룹설명이 같은 모든 행 */
    int deleteByKey(CodeGroupKeyParam param);

    /** UpdateDataModel.deleteModel */
    int deleteByIds(@Param("codeGroupIds") List<Long> codeGroupIds);
}
