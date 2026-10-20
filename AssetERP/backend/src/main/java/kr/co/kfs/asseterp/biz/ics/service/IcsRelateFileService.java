package kr.co.kfs.asseterp.biz.ics.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsFormFileRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsRelateFileRes;
import kr.co.kfs.asseterp.biz.ics.mapper.IcsRelateFileMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * AS-IS server/sys/Sys11_RelateFile.java (selectByParentId L33 / insert L143 / delete L199) + Sys10_File.getIcsFile — Ics01_Lookup_IcsFile·Ics01_Lookup_IcsFileAdmin.
 * 법규(ics01_class_tree)에 붙은 서식파일 연결만 다룬다. 쓰기는 관리자 회사만(보안 보강)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IcsRelateFileService {

    private static final String PARENT_TABLE = "ics01_class_tree";

    private final IcsRelateFileMapper mapper;

    /** AS-IS sys.Sys11_RelateFile.selectByParentId */
    public List<IcsRelateFileRes> searchByParentId(Long parentId) {
        return mapper.selectByParentId(parentId);
    }

    /** AS-IS sys.Sys10_File.getIcsFile(parentId 0, lawType null, firstRegDateYn true): 불러올 서식파일 */
    public List<IcsFormFileRes> searchFormFiles(String searchText) {
        return mapper.selectIcsFormFiles("%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS sys.Sys10_File.getIcsFile(parentId 0, lawType null): 법규보고 서식파일 목록(H07) — 법령구분·내용 순. 검색어는 서비스가 %…%로 */
    public List<IcsFormFileRes> searchFormFilesUser(String searchText) {
        return mapper.selectIcsFormFilesUser("%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS sys.Sys11_RelateFile.insert: 이미 연결된 파일은 건너뛰고 새 연결만 만든다 → 새로 연결한 건수 */
    @Transactional
    public int insert(UserPrincipal user, Long relateId, List<Long> fileIds) {
        IcsClassTreeService.requireSysAdmin(user);
        int count = 0;
        for (Long fileId : fileIds) {
            if (mapper.countRelate(fileId, relateId) == 0) {
                mapper.insertRelate(mapper.selectNextId(), fileId, relateId, PARENT_TABLE);
                count++;
            }
        }
        return count;
    }

    /** AS-IS sys.Sys11_RelateFile.delete(체크한 연결): 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, Long parentId, List<Long> relateFileIds) {
        IcsClassTreeService.requireSysAdmin(user);
        int count = 0;
        for (Long id : relateFileIds) {
            count += mapper.deleteRelate(id, parentId);
        }
        return count;
    }
}
